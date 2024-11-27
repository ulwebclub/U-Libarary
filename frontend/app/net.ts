// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as axios from "axios";
// @ts-expect-error no type declare
import Base64 from "base-64";
import {toast} from "react-toastify";

const axiosInstance = axios.default.create({
    withCredentials: true,
    timeout: 5000
});

interface TempData {
    data: any,
    startTime: number
}

const temp: {[Keys: string]: TempData} = {};
const TEMP_STORE_TIME = 1000;  // ms

function solveErr(e: never) {
    if (e.response.status === 401) {
        toast.error("Unauthorized", {
            toastId: 401,
            onClick: () => {
                toLogin();
            },
            onClose: () => {
                toLogin();
            }
        });
    } else {
        const err = e.response.data || e.message || "Something went wrong";
        toast.error(err, {
            toastId: err
        });
    }
}

function getTempKey(url: string, data?: any) {
    return url + Base64.encode(JSON.stringify(data));
}

function insertTemp(tempKey: string, data: any) {
    const current = new Date().getTime();
    temp[tempKey] = {
        data: data,
        startTime: current
    };

    // 删除超时的数据
    setTimeout(() => {
        for (let i = 0; i < temp.length; i++) {
            if (current - temp[i].startTime > TEMP_STORE_TIME) {
                temp[i] = undefined;
            }
        }
    }, 0);
}

function getTempData(tempKey: string) {
    const current = new Date().getTime();

    const d = temp[tempKey];
    if (d === undefined) {
        return undefined;
    } else {
        if (current - d.startTime > TEMP_STORE_TIME) {
            temp[tempKey] = undefined;
            return undefined;
        } else {
            return d.data;
        }
    }
}

export async function getReq(url: string) {
    const k = getTempKey(url);
    const d = getTempData(k);
    if (d !== undefined) return d;

    try {
        const res = await axiosInstance.get(`/api/${url}`);
        insertTemp(k, res.data);
        return res.data;
    } catch (e) {
        solveErr(e);
        return undefined;
    }
}

export async function postReq(url: string, data = {}) {
    const k = getTempKey(url, data);
    const d = getTempData(k);
    if (d !== undefined) return d;

    try {
        const res = await axiosInstance.post(`/api/${url}`, data);
        insertTemp(k, res.data);
        return res.data;
    } catch (e) {
        solveErr(e);
        return undefined;
    }
}

export async function deleteReq(url: string) {
    const k = getTempKey(url);
    const d = getTempData(k);
    if (d !== undefined) return d;

    try {
        const res = await axiosInstance.delete(`/api/${url}`);
        insertTemp(k, res.data);
        return res.data;
    } catch (e) {
        solveErr(e);
        return undefined;
    }
}

function toLogin() {
    window.location.href = '/';
}