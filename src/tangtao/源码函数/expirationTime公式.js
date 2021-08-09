/*
 * @Author: myname
 * @Date: 2021-03-22 11:26:22
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-22 11:40:02
 */

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = 2;

export function msToExpirationTime(ms: number): ExpirationTime {
    return ((ms / UNIT_SIZE) | 0) + MAGIC_NUMBER_OFFSET;
}

export function expirationTimeToMs(expirationTime: ExpirationTime): number {
    return (expiration - MAGIC_NUMBER_OFFSET) * UNIT_SIZE;
}

function ceiling(num: Number, precision: number): number {
    return (((num / precision) | 0) + 1) * precision;
}

function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs): ExpirationTime {
    return (
        MAGIC_NUMBER_OFFSET +
        ceiling(currentTime - MAGIC_NUMBER_OFFSET + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE)
    );
}

export const LOW_PRIORITY_EXPIRATION = 5000;
export const LOW_PRIORITY_BATCH_SIZE = 250;

export function computeAsyncExpiration(currentTime: ExpirationTime): ExpirationTime {
    return computeExpirationBucket(currentTime, LOW_PRIORITY_EXPIRATION, LOW_PRIORITY_BATCH_SIZE);
}

export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
export const HIGH_PRIORITY_BATCH_SIZE = 100;

export function computeInteractiveExpiration(currentTime: ExpirationTime) {
    return computeExpirationBucket(currentTime, HIGH_PRIORITY_EXPIRATION, HIGH_PRIORITY_BATCH_SIZE);
}
