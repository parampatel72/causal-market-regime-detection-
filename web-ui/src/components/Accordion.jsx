import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

/**
 * Accordion Component
 * Smooth animated expand/collapse with chevron rotation
 */
export function AccordionItem({ title, children, defaultOpen = false, className }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={clsx('accordion-item', className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="accordion-trigger"
            >
                <span>{title}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="accordion-content">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Accordion({ items, className }) {
    return (
        <div className={clsx('divide-y divide-[var(--color-border-subtle)]', className)}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    defaultOpen={item.defaultOpen}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
}
