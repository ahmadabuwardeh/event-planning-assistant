"use client";

import { io } from "socket.io-client";

const baseURL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export const socket = io(baseURL);
