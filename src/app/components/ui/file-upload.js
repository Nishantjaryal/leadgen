import { cn } from "../../lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 20,
        y: -20,
        opacity: 0.9,
    },
};

const secondaryVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
};

export const FileUpload = ({
    onChange,
    engageBtn,  // Fixed typo: engaugeBTN -> engageBtn
    isLoading   // Fixed typo: isoLading -> isLoading
}) => {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (newFile) => {
        setFiles((prevFiles) => [...prevFiles, newFile]);
        engageBtn(true);  // Fixed typo and added semicolon

        onChange(newFile);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const { getRootProps, isDragActive } = useDropzone({
        multiple: false,
        noClick: true,
        onDrop: handleFileChange,
        onDropRejected: (error) => {
            console.log(error);
            engageBtn(false);  // Fixed typo
        },
    });

    return (
        <div className="w-full" {...getRootProps()}>
            <motion.div
                onClick={handleClick}
                whileHover="animate"
                className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden">
                <input
                    ref={fileInputRef}
                    id="file-upload-handle"
                    type="file"
                    accept=".csv,text/csv"
                    disabled={isLoading}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.name.endsWith('.csv')) {
                            handleFileChange(file);
                        } else {
                            alert("Please upload a valid CSV file.");
                            e.target.value = ""; // Reset input if invalid file
                        }
                    }}
                    className="hidden"
                />
                <div
                    className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                    <GridPattern />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p
                        className="relative z-20 w-full sm:text-center font-sans font-bold text-neutral-300 text-base">
                        Upload file
                    </p>
                    <p
                        className="relative w-full sm:text-center z-20 font-sans font-normaltext-neutral-400 text-base mt-2">
                        Drag or drop your CSV file here or click to upload
                    </p>
                    <div className="relative w-full mt-10 max-w-xl mx-auto">
                        {files.length > 0 &&
                            files.map((file, idx) => (
                                <motion.div
                                    key={"file" + idx}
                                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                                    className={cn(
                                        "relative overflow-hidden z-40 bg-gray-950 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded",
                                        "shadow-sm"
                                    )}>
                                    <div className="flex justify-between w-full items-center gap-4">
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                                            {file.name}
                                        </motion.p>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            className="rounded-lg px-2 hidden sm:block py-1 w-fit shrink-0 text-sm bg-blue-600 text-neutral-200 shadow-input">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </motion.p>
                                    </div>

                                    <div
                                        className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-300">
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            className="px-1 py-0.5 rounded-md bg-blue-700 text-neutral-300">
                                            {file.type}
                                        </motion.p>

                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            className="text-neutral-400">
                                            modified{" "}
                                            {new Date(file.lastModified).toLocaleDateString()}
                                        </motion.p>
                                    </div>
                                </motion.div>
                            ))}
                        {!files.length && (
                            <motion.div
                                layoutId="file-upload"
                                variants={mainVariant}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className={cn(
                                    "relative group-hover/file:shadow-2xl z-40 bg-blue-900 dark:bg-blue-800 flex items-center justify-center h-32 mt-4 w-full max-w-[10rem] mx-auto rounded-md",
                                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                                )}>
                                {isDragActive ? (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-neutral-100 dark:text-neutral-200 flex flex-col items-center">
                                        Drop it
                                        <IconUpload className="h-4 w-4 text-neutral-300 dark:text-neutral-400" />
                                    </motion.p>
                                ) : (
                                    <IconUpload className="h-4 w-4 text-neutral-300 dark:text-neutral-400" />
                                )}
                            </motion.div>
                        )}

                        {!files.length && (
                            <motion.div
                                variants={secondaryVariant}
                                className="absolute opacity-0 border border-dashed border-sky-500 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[10rem] mx-auto rounded-md"></motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export function GridPattern() {
    const columns = 41;
    const rows = 11;
    return (
        <div
            className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
            {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: columns }).map((_, col) => {
                    const index = row * columns + col;
                    return (
                        <div
                            key={`${col}-${row}`}
                            className={`w-10 h-10 flex shrink-0 rounded-[2px] ${index % 2 === 0
                                    ? "bg-neutral-950 dark:bg-neutral-800"
                                    : "bg-neutral-950 dark:bg-neutral-800 shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(255,255,255,0.1)_inset]"
                                }`} />
                    );
                }))}
        </div>
    );
}