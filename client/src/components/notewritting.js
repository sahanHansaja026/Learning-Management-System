import React, { useRef, useState } from "react";
import axios from "axios";
import "../css/notewritter.css";

function Editor() {
  const contentRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false); // state to track the save status

  // Handle text formatting
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // Handle font size change
  const setFontSize = (size) => {
    document.execCommand("fontSize", false, "7"); // Use largest font size
    const fontElements = document.getElementsByTagName("font");
    for (let font of fontElements) {
      if (font.size === "7") {
        font.removeAttribute("size");
        font.style.fontSize = `${size}px`;
      }
    }
  };

  // Handle image drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => insertImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle image paste
  const handlePaste = (event) => {
    const items = (event.clipboardData || window.clipboardData).items;
    for (let item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => insertImage(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  // Insert image with controls
  const insertImage = (src) => {
    const content = contentRef.current;

    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "100%";

    const controls = document.createElement("div");
    controls.className = "image-controls";
    controls.innerHTML = `
      <button onclick="alignImage(this, 'left')">Align Left</button>
      <button onclick="alignImage(this, 'center')">Center</button>
      <button onclick="alignImage(this, 'right')">Align Right</button>
      <button onclick="resizeImage(this, '150px')">Small</button>
      <button onclick="resizeImage(this, '300px')">Medium</button>
      <button onclick="resizeImage(this, '600px')">Large</button>
      <button onclick="this.parentNode.parentNode.remove()">Remove</button>
    `;

    const container = document.createElement("div");
    container.style.textAlign = "center";
    container.appendChild(img);
    container.appendChild(controls);

    content.appendChild(container);
  };

  // Align image function
  const alignImage = (button, alignment) => {
    const img = button.parentNode.previousElementSibling;
    img.style.textAlign = alignment;
  };

  // Resize image function
  const resizeImage = (button, size) => {
    const img = button.parentNode.previousElementSibling;
    img.style.width = size;
  };

  // Save article function
  const saveArticle = async () => {
    setIsSaving(true); // Start saving
    const content = contentRef.current.innerHTML; // Get the HTML content from the editor

    try {
      // Assuming you have an endpoint `/api/saveArticle` that accepts POST requests
      const response = await axios.post(
        "http://localhost:9001/saveArticle",
        { content }
      );

      if (response.data.success) {
        alert("Article saved successfully!");
      } else {
        alert("Failed to save article.");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      alert("An error occurred while saving the article.");
    } finally {
      setIsSaving(false); // End saving process
    }
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={() => formatText("bold")}>Bold</button>
        <button onClick={() => formatText("italic")}>Italic</button>
        <button onClick={() => formatText("underline")}>Underline</button>
        <button onClick={() => formatText("justifyLeft")}>Align Left</button>
        <button onClick={() => formatText("justifyCenter")}>Center</button>
        <button onClick={() => formatText("justifyRight")}>Align Right</button>
        <button onClick={() => formatText("insertUnorderedList")}>
          Bullet List
        </button>
        <select onChange={(e) => setFontSize(e.target.value)}>
          <option value="11">11px</option>
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
          <option value="22">22px</option>
          <option value="25">25px</option>
        </select>
        <select onChange={(e) => formatText("formatBlock", e.target.value)}>
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>
        <button onClick={saveArticle} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Article"}
        </button>
      </div>
      <div
        ref={contentRef}
        className="editable-content"
        contentEditable
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        placeholder="Write your content here..."
      ></div>
    </div>
  );
}

export default Editor;
