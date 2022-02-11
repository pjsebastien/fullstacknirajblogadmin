import { init } from 'create-react-app/createReactApp';
import React, { useEffect, useState } from 'react';
import {
    ImEye,
    ImFileEmpty,
    ImFilePicture,
    ImSpinner11,
    ImSpinner3,
} from 'react-icons/im';
// import { matchPath } from 'react-router-dom';
import { uploadImage } from '../api/post';
import { useNotification } from '../Context/NotificationProvider';
import MarkdownPost from './MarkdownPost';

export const defaultPost = {
    title: '',
    thumbnail: '',
    featured: false,
    content: '',
    tags: '',
    meta: '',
};

export default function PostForm({
    initialPost,
    busy,
    postButtonTitle,
    onSubmit,
    resetAfterSubmit,
}) {
    const [postInfo, setPostInfo] = useState({ ...defaultPost });
    const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState('');
    const [imageUrlToCopy, setImageUrlToCopy] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    const [displayMarkdown, setDisplayMarkdown] = useState(false);
    const { updateNotification } = useNotification();

    const resetForm = () => {
        setPostInfo({ ...defaultPost });
        localStorage.removeItem('blogPost');
    };

    useEffect(() => {
        if (initialPost?.thumbnail) {
            setSelectedThumbnailUrl(initialPost.thumbnail);
        }
        setPostInfo({ ...initialPost });
        return () => {
            if (resetAfterSubmit) resetForm();
        };
    }, [initialPost, resetAfterSubmit]);

    const handleChange = ({ target }) => {
        const { value, name, checked } = target;

        if (name === 'thumbnail') {
            const file = target.files[0];
            if (!file.type?.includes('image')) {
                return updateNotification('error', 'Image non valide');
            }
            setPostInfo({ ...postInfo, thumbnail: file });
            return setSelectedThumbnailUrl(URL.createObjectURL(file));
        }
        if (name === 'featured') {
            localStorage.setItem(
                'blogPost',
                JSON.stringify({ ...postInfo, featured: checked }),
            );
            return setPostInfo({ ...postInfo, [name]: checked });
        }
        if (name === 'tags') {
            const newTags = tags.split(', ');
            if (newTags.length > 4) {
                updateNotification(
                    'warning',
                    'Seuls les 4 premiers tags seront pris en compte !',
                );
            }
        }
        if (name === 'meta' && meta.length >= 150) {
            return setPostInfo({ ...postInfo, meta: value.substring(0, 149) });
        }

        const newPost = { ...postInfo, [name]: value };
        setPostInfo({ ...newPost });
        localStorage.setItem('blogPost', JSON.stringify(newPost));
    };

    const handleImageUpload = async ({ target }) => {
        if (imageUploading) return;
        const file = target.files[0];
        if (!file.type?.includes('image')) {
            return updateNotification('error', 'Image non valide');
        }
        setImageUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        const { error, image } = await uploadImage(formData);
        setImageUploading(false);
        if (error) return console.log(error);
        setImageUrlToCopy(image);
    };
    const handleOnCopy = () => {
        const textToCopy = `![Ajouter une brève description de l'image ici](${imageUrlToCopy})`;
        navigator.clipboard.writeText(textToCopy);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const { title, content, featured, tags, meta } = postInfo;
        if (!title.trim()) return updateNotification('error', 'Veuillez écrire un titre');
        if (!content.trim())
            return updateNotification('error', 'Veuillez écrire un contenu');
        if (!tags.trim()) return updateNotification('error', 'Veuillez entrer les tags');
        if (!meta.trim())
            return updateNotification('error', 'Veuillez écrire une méta-description');

        const slug = title
            .toLowerCase()
            .replace(/[^a-zA-Z]/g, ' ')
            .split(' ')
            .filter(item => item.trim())
            .join('-');

        const newTags = tags
            .split(',')
            .map(item => item.trim())
            .splice(0, 4);

        const formData = new FormData();

        const finalPost = { ...postInfo, tags: JSON.stringify(newTags), slug };
        for (let key in finalPost) {
            formData.append(key, finalPost[key]);
        }

        onSubmit(formData);
        if (resetAfterSubmit) resetForm();
    };

    const { title, content, featured, tags, meta } = postInfo;
    return (
        <form onSubmit={handleSubmit} className="p-2 flex">
            <div className="w-9/12 space-y-3 flex flex-col h-screen ">
                {/* Title and submit */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-700">
                        Créer une publication
                    </h1>
                    <div className="flex items-center space-x-5">
                        <button
                            type="button"
                            className="flex items-center space-x-2 px-3 ring-1 ring-blue-500 rounded h-10 text-blue-500 hover:text-white hover:bg-blue-500 transition"
                        >
                            <ImSpinner11 />
                            <span>Reset</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center space-x-2 px-3 ring-1 ring-blue-500 rounded h-10 text-blue-500 hover:text-white hover:bg-blue-500 transition"
                        >
                            <ImEye />
                            <span>View</span>
                        </button>
                        <button className="h-10 w-32 hover:ring-1 bg-blue-500 rounded text-white hover:text-blue-500 hover:bg-transparent hover:ring-blue-500 transition">
                            {busy ? (
                                <ImSpinner3 className="animate-spin mx-auto text-xl" />
                            ) : (
                                postButtonTitle
                            )}
                        </button>
                    </div>
                </div>

                {/* featured checkbox */}
                <div className="flex">
                    <input
                        name="featured"
                        onChange={handleChange}
                        value={featured}
                        type="checkbox"
                        hidden
                        id="featured"
                    />
                    <label
                        className=" select-none flex items-center space-x-2 text-gray-700 cursor-pointer group"
                        htmlFor="featured"
                    >
                        <div className="w-4 h-4 rounded-full border-2 border-gray-700 flex items-center justify-center group-hover:border-blue-500">
                            {featured && (
                                <div className="w-2 h-2 rounded-full bg-gray-700 group-hover::bg-blue-500"></div>
                            )}
                        </div>
                        <span className="group-hover:text-blue-500">A la une</span>
                    </label>
                </div>
                {/* title input */}
                <input
                    value={title}
                    onFocus={() => {
                        setDisplayMarkdown(false);
                    }}
                    name="title"
                    type="text"
                    onChange={handleChange}
                    className="text-xl outline-none focus:ring-1 rounded p-2 w-full font-semibold"
                    placeholder="Titre"
                />

                {/* image input */}

                <div className="flex space-x-2">
                    <div>
                        <input
                            onChange={handleImageUpload}
                            id="image-input"
                            type="file"
                            hidden
                        />
                        <label
                            htmlFor="image-input"
                            className="flex items-center space-x-2 px-3 ring-1 ring-gray-300 rounded h-10 text-gray-700 hover:text-white hover:bg-blue-500 transition cursor-pointer"
                        >
                            {!imageUploading ? (
                                <ImFilePicture />
                            ) : (
                                <ImSpinner3 className="animate-spin" />
                            )}
                            <span>Selectionner une image</span>
                        </label>
                    </div>
                    )
                    {imageUrlToCopy && (
                        <div className="flex flex-1 bg-gray-400 justify-between rounded overflow-hidden ">
                            <input
                                className="bg-transparent px-2 text-white w-full"
                                type="text"
                                value={imageUrlToCopy}
                                disabled
                            />
                            <button
                                onClick={handleOnCopy}
                                type="button"
                                className="text-xs flex flex-col items-center self-stretch justify-center p-1 bg-gray-500 hover:bg-gray-600 transition text-white"
                            >
                                <ImFileEmpty />
                                <span className="">Copier</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* text input */}
                <textarea
                    value={content}
                    onFocus={() => {
                        setDisplayMarkdown(true);
                    }}
                    onChange={handleChange}
                    name="content"
                    className="resize-none w-full outline-none focus:ring-1 rounded p-2 w-full font-semibold flex-1 font-mono tracking-wide text-lg"
                    placeholder="## Markdown"
                ></textarea>

                {/* tags input */}
                <div>
                    <label className="text-gray-500" htmlFor="tags">
                        Tags
                    </label>
                    <input
                        value={tags}
                        onChange={handleChange}
                        name="tags"
                        type="text"
                        id="tags"
                        className="outline-none focus:ring-1 rounded p-2 w-full "
                        placeholder="Tag un, Tag deux, ..."
                    />
                </div>
                {/* meta input */}
                <div>
                    <label className="text-gray-500" htmlFor="meta">
                        Meta description {meta?.length} / 150
                    </label>
                    <textarea
                        value={meta}
                        onChange={handleChange}
                        name="meta"
                        id="meta"
                        className="resize-none w-full outline-none focus:ring-1 rounded p-2 w-full h-28"
                        placeholder="Entrez la méta description..."
                    ></textarea>
                </div>
            </div>
            <div className="w-1/4 px-2 relative">
                <h1 className="text-xl font-semibold text-gray-700 mb-2 ml-2">
                    Vignette
                </h1>
                <div className="">
                    <input
                        onChange={handleChange}
                        name="thumbnail"
                        id="thumbnail"
                        type="file"
                        hidden
                    />
                    <label htmlFor="thumbnail" className="cursor-pointer">
                        {selectedThumbnailUrl ? (
                            <img
                                src={selectedThumbnailUrl}
                                className="aspect-video shadow-sm rounded"
                                alt=""
                            />
                        ) : (
                            <div className="border border-dashed border-gray-500 aspect-video text-gray-500 flex flex-col justify-center items-center">
                                <span>Sélectionner une image</span>
                                <span className="text-xs">Taille recommandée</span>
                                <span className="text-xs">1280 * 720 px</span>
                            </div>
                        )}
                    </label>
                </div>

                {/* Markdown rules */}
                <div className="absolute top-1/2 -translate-y-1/2">
                    {displayMarkdown && <MarkdownPost />}
                </div>
            </div>
        </form>
    );
}
