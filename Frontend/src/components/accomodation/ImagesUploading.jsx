import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ImagesUploading = ({ field }) => {
  const [imageInput, setImageInput] = useState("");

  const handleImageInputChange = (event) => {
    setImageInput(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          public_id: `file_${Date.now()}`,
          url: e.target.result,
        };
        field.handleChange([...field.state.value, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;

    try {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("unsupported protocol");
      }
    } catch {
      toast.error("Enter a valid image link beginning with http:// or https://");
      return;
    }

    const images = field.state.value || [];
    if (images.some((image) => image.url === url)) {
      toast.error("This image has already been added");
      return;
    }

    field.handleChange([
      ...images,
      { public_id: `url_${Date.now()}`, url },
    ]);
    setImageInput("");
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...field.state.value];
    updatedImages.splice(index, 1);
    field.handleChange(updatedImages);
  };

  return (
    <div className="photos-container">
      <h4 className="photos-header">Photos</h4>
      <label className="form-labels">More = Better</label>

      <div className="image-link-container">
        <input
          className="image-link"
          type="url"
          placeholder="Paste an image URL (https://...)"
          onChange={handleImageInputChange}
          value={imageInput}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAddImage();
            }
          }}
        />
        <button className="add-button" type="button" onClick={handleAddImage}>
          Add
        </button>
      </div>

      <div className="image-list-container">
        {field.state.value.map((imageObj, index) => (
          <div key={index} className="image-preview-box">
            <img
              alt={`Image-${index}`}
              src={imageObj.url}
              className="preview-image"
              height="200px"
              width="200px"
            />
            <button
              type="button"
              onClick={() => handleDeleteImage(index)}
              className="delete-btn"
            >
              <Trash2 />
            </button>
          </div>
        ))}

        <label className="upload">
          <input
            type="file"
            accept="image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="material-symbols-outlined">upload</span>
          Upload Photo
        </label>
      </div>
    </div>
  );
};

export default ImagesUploading;
