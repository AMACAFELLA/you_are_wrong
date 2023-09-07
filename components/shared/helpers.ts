import Resizer from "react-image-file-resizer";


export const formattedDateString = (date: string) => {
    const newDate = new Date(date);

    const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        day: "numeric",
        month: "short",
        year: "numeric",
    };
    let dateSplitted = newDate
        // @ts-ignore
        .toLocaleString("en-US", options)
        .split(", ")
        .reverse();

    return dateSplitted[0] + ", " + dateSplitted[2] + " - " + dateSplitted[1];
};

export const getContrastingColor = (color: any) => {
    // Remove the '#' character if it exists
    try {
        const hex = color.replace("#", "");

        // Convert the hex string to RGB values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Calculate the brightness of the color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Return black or white depending on the brightness
        return brightness > 128 ? "black" : "white";
    }
    catch (e: any) {
        debugger;
        console.log(e)
    }
};
export const reader = (file: any) =>
    new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            var image = new Image();
            // @ts-ignore
            image.src = e.target.result;
            //Validate the File Height and Width.
            image.onload = function () {
                // @ts-ignore
                var height = this.height;
                // @ts-ignore
                var width = this.width;
                resolve({ "file": fileReader.result, "width": width, "height": height });
            };


        }
        if (file && file.name)
            fileReader.readAsDataURL(file);
    });
export const readerResizer = (file: any): Promise<string | Blob | ProgressEvent<FileReader> | File> => {
    return new Promise((resolve, _reject) => {
        reader(file)
            .then((result: any) => {
                const width: number = result["width"]
                const height: number = result["height"]
                const ratio = width / height;
                let maxFixed = 512;
                console.log("Original : " + width + " X " + height)

                var fileFormat: string = file.name.split(".")[file.name.split(".").length - 1]
                if (fileFormat === "jpg") {
                    fileFormat = "jpeg";
                }

                fileFormat = fileFormat.toUpperCase()
                var finalWidth = 0
                var finalHeight = 0
                if (width < maxFixed && height < maxFixed) {
                    console.log("Not Resized : " + width + " X " + height)
                    resolve(result["file"])
                }
                else {
                    if (ratio >= 1) {
                        finalWidth = maxFixed;
                        const wRatio = maxFixed / width
                        finalHeight = Math.round(height * wRatio)
                    }
                    else {
                        finalHeight = maxFixed;
                        const hRatio = maxFixed / height
                        finalWidth = Math.round(width * hRatio)
                    }
                    console.log("Resized : " + finalWidth + " X " + finalHeight)
                    Resizer.imageFileResizer(
                        file,
                        finalWidth,
                        finalHeight,
                        fileFormat,
                        100,
                        0,
                        (uri) => {
                            resolve(uri);
                        },
                        "base64"
                    );
                }

            }).catch(e => {
                console.error(e)
                _reject(e);
            })
    })

}
export const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}
