import axios from "axios";
import { Message } from "../types/Message";
import { invoke } from "@tauri-apps/api";

type ApiResponse = {
    status: number;
    data: any;
}

export default async function request(accountNumber: string, messages: Message[], { controller }: { controller?: AbortController }): Promise<ApiResponse> {

    let status = 500;
    let data = {};
    try {

        const url: string = await invoke("get_server_url")

        let res = await axios.post(url, {
            messages: messages
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "POST",
                'Content-Type': 'application/json',
                'api-key': accountNumber
            },
            signal: controller?.signal,
            timeout: 60000,
        })

        status = res.status;

        if (res.data) {
            data = res.data;
        }
    }
    catch (e: any) {
        console.log(e)
        if (e.response) {
            if (e.response.data) {
                data = e.response.data;
            }
            if (e.response.status) {
                status = e.response.status;
            }
        }

        if (e.code === "ERR_CANCELED") {
            return { status: 0, data: {} }
        }


        return { status, data }
    }

    return { status, data }
}