import type { TResponseResult } from "../global";
import axios from "axios";

export const getHeartbeatService = () =>
    axios.get("/heartbeats").then<TResponseResult<any>>(({ data }) => data);
