// src/hooks/useCollectionWithPaginationInCursors.js
import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  startAfter,
  endBefore,
  limitToLast,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function useCollectionWithPaginationInCursors({
  size = 10,
  orderByQueries = [],
  whereQueries = [],
  isDependantLoading = false,
  __collection__,
  refreshTrigger = 0,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [pagesNumber, setPagesNumber] = useState(0);

  // Refs to store first and last document snapshots for pagination
  const firstVisibleRef = useRef(null);
  const lastVisibleRef = useRef(null);

  // Refs to store all previous page cursor states
  const pageStateRef = useRef([]);

  // Function to calculate total document count and number of pages
  const getCollectionCount = async () => {
    try {
      // Create base query with where conditions
      let q = collection(db, __collection__);

      // Add where clauses if provided
      if (whereQueries && whereQueries.length > 0) {
        whereQueries.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      // Get count
      const countSnapshot = await getCountFromServer(q);
      const totalCount = countSnapshot.data().count;

      // Calculate number of pages
      const totalPages = Math.ceil(totalCount / size);

      setCount(totalCount);
      setPagesNumber(totalPages);

      return { totalCount, totalPages };
    } catch (err) {
      console.error("Error getting collection count:", err);
      setError(err);
      return { totalCount: 0, totalPages: 0 };
    }
  };

  // Initial data fetching
  useEffect(() => {
    const fetchData = async () => {
      if (isDependantLoading) return;

      setLoading(true);
      setError(null);

      try {
        // Get collection count and pages
        await getCollectionCount();

        // Create base query
        let q = collection(db, __collection__);

        // Add where clauses if provided
        if (whereQueries && whereQueries.length > 0) {
          whereQueries.forEach(({ field, operator, value }) => {
            q = query(q, where(field, operator, value));
          });
        }

        // Add orderBy clauses
        if (orderByQueries && orderByQueries.length > 0) {
          orderByQueries.forEach(({ field, direction }) => {
            q = query(q, orderBy(field, direction));
          });
        }

        // Add limit
        q = query(q, limit(size));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Store first and last visible document snapshots
          firstVisibleRef.current = querySnapshot.docs[0];
          lastVisibleRef.current =
            querySnapshot.docs[querySnapshot.docs.length - 1];

          // Store current page state
          pageStateRef.current = [
            {
              first: querySnapshot.docs[0],
              last: querySnapshot.docs[querySnapshot.docs.length - 1],
            },
          ];

          // Map documents to data
          const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setData(documents);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    __collection__,
    size,
    JSON.stringify(whereQueries),
    JSON.stringify(orderByQueries),
    isDependantLoading,
    refreshTrigger,
  ]);

  // Function to handle getting the next page
  const HandleGetNextPage = async () => {
    if (loading || page >= pagesNumber - 1) return;

    setLoading(true);

    try {
      // Create base query
      let q = collection(db, __collection__);

      // Add where clauses if provided
      if (whereQueries && whereQueries.length > 0) {
        whereQueries.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      // Add orderBy clauses
      if (orderByQueries && orderByQueries.length > 0) {
        orderByQueries.forEach(({ field, direction }) => {
          q = query(q, orderBy(field, direction));
        });
      }

      // Start after the last visible document
      q = query(q, startAfter(lastVisibleRef.current), limit(size));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update first and last visible document snapshots
        firstVisibleRef.current = querySnapshot.docs[0];
        lastVisibleRef.current =
          querySnapshot.docs[querySnapshot.docs.length - 1];

        // Store current page state
        pageStateRef.current.push({
          first: querySnapshot.docs[0],
          last: querySnapshot.docs[querySnapshot.docs.length - 1],
        });

        // Map documents to data
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(documents);
        setPage(page + 1);
      }
    } catch (err) {
      console.error("Error fetching next page:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle getting the previous page
  const HandleGetPreviousPage = async () => {
    if (loading || page <= 0) return;

    setLoading(true);

    try {
      // Create base query
      let q = collection(db, __collection__);

      // Add where clauses if provided
      if (whereQueries && whereQueries.length > 0) {
        whereQueries.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      // Add orderBy clauses
      if (orderByQueries && orderByQueries.length > 0) {
        orderByQueries.forEach(({ field, direction }) => {
          q = query(q, orderBy(field, direction));
        });
      }

      // If we have previous page state, use it
      if (page > 1) {
        // Get the previous page state
        const prevPageState = pageStateRef.current[page - 1];

        // End before the first visible document of the current page
        q = query(q, endBefore(firstVisibleRef.current), limitToLast(size));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Update first and last visible document snapshots
          firstVisibleRef.current = querySnapshot.docs[0];
          lastVisibleRef.current =
            querySnapshot.docs[querySnapshot.docs.length - 1];

          // Update page state
          pageStateRef.current.pop(); // Remove current page state

          // Map documents to data
          const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setData(documents);
          setPage(page - 1);
        }
      } else if (page === 1) {
        // If we're on the first page, get the initial page again
        q = query(q, limit(size));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Update first and last visible document snapshots
          firstVisibleRef.current = querySnapshot.docs[0];
          lastVisibleRef.current =
            querySnapshot.docs[querySnapshot.docs.length - 1];

          // Reset page state
          pageStateRef.current = [
            {
              first: querySnapshot.docs[0],
              last: querySnapshot.docs[querySnapshot.docs.length - 1],
            },
          ];

          // Map documents to data
          const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setData(documents);
          setPage(0);
        }
      }
    } catch (err) {
      console.error("Error fetching previous page:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    count,
    pagesNumber,
    page,
    HandleGetNextPage,
    HandleGetPreviousPage,
  };
}
