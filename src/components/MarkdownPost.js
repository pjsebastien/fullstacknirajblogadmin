import React, { useEffect, useRef } from 'react';

const mdRules = [
    { title: 'De h1 à h6', rule: 'Heading -> ###### Heading' },
    { title: 'Citation', rule: '> Votre citation' },
    { title: 'Image', rule: '![image alt](http://image-url.com)' },
    { title: 'Lien', rule: '[Link Text](http://votre-lien.com)' },
];

export default function MarkdownPost() {
    const container = useRef();
    useEffect(() => {
        container.current?.classList.remove('-translate-y-5', 'opacity-0');
        container.current?.classList.add('-translate-y-0', 'opacity-1');
    }, []);
    return (
        <div
            ref={container}
            className="bg-white px-2 py-4 rounded -translate-y-5 opacity-0 transition"
        >
            <h1 className="font-semibold text-center text-gray-700 pb-4">
                Règles générales de Markdown
            </h1>
            <ul className="space-y-2">
                {mdRules.map(({ title, rule }) => {
                    return (
                        <li key={title} className="">
                            <p className="font-semibold text-gray-500">{title}</p>
                            <p className="font-semibold text-gray-600 pl-2 font-mono">
                                {rule}
                            </p>
                        </li>
                    );
                })}
                <li className="text-center text-blue-500 text-sm pt-2">
                    <a href="https://www.markdownguide.org/basic-syntax/" target="_blank">
                        Plus de règles Markdown
                    </a>{' '}
                </li>
            </ul>
        </div>
    );
}
