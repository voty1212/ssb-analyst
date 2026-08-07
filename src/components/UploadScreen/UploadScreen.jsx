import { useRef, useState } from 'react'
import './UploadScreen.css'

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp']

function UploadScreen({ onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  function pickFile(file) {
    if (!file || !ACCEPTED_TYPES.includes(file.type)) return
    setSelectedFile(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    pickFile(e.dataTransfer.files[0])
  }

  function handleSubmit() {
    if (selectedFile) onUpload(selectedFile)
  }

  return (
    <div className="upload-screen">
      <div
        className={
          isDragging
            ? 'upload-screen__zone upload-screen__zone--dragging'
            : 'upload-screen__zone'
        }
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <p className="upload-screen__prompt">
          Drag and drop today's newspaper here, or click to browse
        </p>
        <p className="upload-screen__hint">PDF or image (PNG, JPEG, WebP)</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="upload-screen__input"
          onChange={(e) => pickFile(e.target.files[0])}
        />
      </div>

      {selectedFile && (
        <div className="upload-screen__selected">
          <span className="upload-screen__filename">{selectedFile.name}</span>
          <button
            type="button"
            className="upload-screen__submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      )}
    </div>
  )
}

export default UploadScreen
