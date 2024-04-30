'use client'

import { Check, Copy } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "./ui/button";

export function CopyCode({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const key = copied ? "copied" : "default";

    return (
        <CopyToClipboard text={code} onCopy={handleCopy}>
            <Button
                key={key}
                className="rounded-lg p-2 h-fit"
                variant={"outline"}
            >
                <AnimatePresence>
                    <motion.span
                        initial={{ opacity: 0, scale: 0, filter: "blur(5px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0, filter: "blur(5px)" }}
                        transition={{ duration: 0.4 }}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </motion.span>
                </AnimatePresence>
            </Button>
        </CopyToClipboard>
    );
}

