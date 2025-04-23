"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAuthMe } from "../store/slice/authSlice";

export function ClientAuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return <>{children}</>;
}
