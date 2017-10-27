const arr: any[] & { _rr?: number } = [
    require("./image1.jpg"),
    require("./image2.jpg"),
    require("./image3.jpg")
];

arr._rr = null;

function rr(): string {
    if (arr._rr === null) {
        arr._rr = 0;
        return arr[0];
    }

    if (arr.length === 1)
        return arr[0];

    if (arr._rr >= arr.length - 1 || arr._rr < 0) {
        arr._rr = 0;
        return arr[0];
    } else {
        arr._rr += 1;
        return arr[arr._rr];
    }
}

export function imageFile(index?: number): string {
    if (!!index && !!arr[index]) {
        return arr[index];
    }
    return rr();
}
