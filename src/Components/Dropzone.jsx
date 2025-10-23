import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileImage, FaTimes } from 'react-icons/fa';

export const Dropzone = ({ onFileUpload, files, setFiles }) => {


    const removeFile = fileName => {
        const newFiles = files.filter(file => file.name !== fileName);
        setFiles(newFiles);
        onFileUpload(newFiles);
    };

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#00909D',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#00909D',
        outline: 'none',
        transition: 'border .24s ease-in-out',
        padding: '20px',
        width: '100%',
        cursor: 'pointer'
    };

    const focusedStyle = {
        borderColor: '#2196f3'
    };

    const acceptStyle = {
        borderColor: '#00e676'
    };

    const rejectStyle = {
        borderColor: '#ff1744'
    };

    const { getRootProps, getInputProps, isFocused, isDragActive, isDragAccept, isDragReject } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: acceptedFiles => {
            const newFiles = acceptedFiles.map(file =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            );
            setFiles([...files, ...newFiles]);
            onFileUpload([...files, ...newFiles]); // Pass new files up to parent component as well
        },
        // maxSize: 5242880,
    });
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
        position: 'relative'
    }), [isFocused, isDragAccept, isDragReject]);

    const thumbs = files.map(file => (
        <div key={file.name} style={{ position: 'relative', width: 100, height: 100, marginRight: 10 }}>
            <img src={file.preview} style={{ width: '100%', height: '100%' }} alt={file.name} loading="lazy" width="100%" height="100%" />
            <button onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();  // This prevents the event from bubbling up to parent elements
                removeFile(file.name);
            }} style={{ position: 'absolute', top: 0, right: 0, border: 'none', background: 'red', borderRadius: '50%', padding: '2px 5px', cursor: 'pointer' }}>
                <FaTimes color="white" />
            </button>
        </div>
    ));

    return (
        <div>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <FaFileImage className='fs-1 my-3' />
                <p className='lh-sm'>Drag 'n' drop product images here, or click to select product images</p>
                <p className='lh-sm'>Multiple images can be uploaded</p>
                <aside style={{ display: 'flex', flexWrap: 'wrap', marginTop: 16 }}>
                    {thumbs}
                </aside>
            </div>
        </div>
    );
};