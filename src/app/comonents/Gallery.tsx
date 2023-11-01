
  'use client'
  import React, { useState, useEffect } from 'react';
  import { DndProvider, useDrag, useDrop } from 'react-dnd';
  import { HTML5Backend } from 'react-dnd-html5-backend';
  
  const Gallery = () => {
    const [images, setImages] = useState([
      '/image-1.webp',
      '/image-2.webp',
      '/image-3.webp',
      '/image-4.webp',
      '/image-5.webp',
      '/image-6.webp',
      '/image-7.webp',
      '/image-8.webp',
      '/image-9.webp',
      '/image-10.jpeg',
      '/image-11.jpeg',
    ]);
  
    const [featuredImage, setFeaturedImage] = useState(null); // Store the featured image separately
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImageIndices, setSelectedImageIndices] = useState([]);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  
    const moveImage = (dragIndex, hoverIndex) => {
      const updatedImages = [...images];
      const [draggedImage] = updatedImages.splice(dragIndex, 1);
      updatedImages.splice(hoverIndex, 0, draggedImage);
  
      if (dragIndex !== images.length - 1 && hoverIndex === images.length - 1) {
        if (featuredImage !== draggedImage) {
          setFeaturedImage(draggedImage);
        }
      }
  
      setImages(updatedImages);
    };
  
    const handleDragStart = (image) => {
      const imageIndex = images.findIndex((img) => img === image);
      if (!selectedImageIndices.includes(imageIndex)) {
        setSelectedImageIndices([...selectedImageIndices, imageIndex]);
      }
    };
  
    const handleDragEnd = () => {
      setSelectedImageIndices([]);
    };
  
    const Image = ({ image, index }) => {
      const [, ref] = useDrop({
        accept: 'IMAGE',
        hover: (draggedItem) => {
          if (draggedItem.index !== index) {
            moveImage(draggedItem.index, index);
            draggedItem.index = index;
            if (index === images.length - 1 && !draggedItem.isFeaturedImage) {
              if (featuredImage !== image) {
                setFeaturedImage(image);
              }
            }
          }
        },
      });
  
      const [, refDrag] = useDrag({
        type: 'IMAGE',
        item: { type: 'IMAGE', index, isFeaturedImage: image === featuredImage },
      });
  
      const opacity = selectedImageIndices.includes(index) ? 0.5 : 1;
  
      const handleClick = () => {
        handleDragStart(image);
      };
  
      return (
        <div
          ref={(node) => ref(refDrag(node))}
          style={{
            opacity,
            background: 'white',
            cursor: 'pointer',
            border: '1px solid #ccc',
            margin: '4px',
            width: '100%',
            height: '100%',
            transition: 'opacity 0.3s ease',
            position: 'relative',
          }}
          onClick={handleClick}
        >
          {selectedImageIndices.includes(index) && (
            <input
              className='absolute z-50 left-2 top-2'
              type="checkbox"
              checked={selectedImages.includes(image)}
              onChange={() => toggleImageSelection(image)}
            />
          )}
          <img src={image} alt={`Image ${index}`} style={{ width: '100%', height: '100%' }} />
        </div>
      );
    };
  
    const toggleImageSelection = (image) => {
      if (selectedImages.includes(image)) {
        setSelectedImages(selectedImages.filter((selectedImage) => selectedImage !== image));
      } else {
        setSelectedImages([...selectedImages, image]);
      }
    };
  
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
  
      if (file) {
        const newImages = [...images];
        newImages.splice(images.length - 1, 0, URL.createObjectURL(file));
        setImages(newImages);
      }
    };
  
    const handleDeleteClick = () => {
      const updatedImages = images.filter((image) => !selectedImages.includes(image));
      setImages(updatedImages);
      setSelectedImages([]);
      setShowDeleteMessage(true);
    };
  
    useEffect(() => {
      localStorage.setItem('imageOrder', JSON.stringify(images));
    }, [images]);
  
    useEffect(() => {
      const storedImageOrder = JSON.parse(localStorage.getItem('imageOrder'));
      if (storedImageOrder) {
        setImages(storedImageOrder);
      }
    }, []);
  
    useEffect(() => {
      if (images.length > 0) {
        // Set the featured image if it's not already set
        if (!featuredImage) {
          setFeaturedImage(images[images.length - 1]);
        }
      }
    }, [images, featuredImage]);
  
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold mb-4">Image Gallery</h2>
            <div>
              {selectedImages.length > 0 && (
                <button onClick={handleDeleteClick}>Delete</button>
              )}
              {showDeleteMessage && (
                <p className="text-red-500">Images deleted successfully.</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="relative row-span-2 col-span-2">
              {featuredImage && (
                <div className="w-full h-full m-1">
                  <img src={featuredImage} alt="Featured" className="w-full h-full bg-white" />
                </div>
              )}
            </div>

          {images.map((image, index) => (
            (image !== featuredImage) && ( // Add this conditional check
              <div
                key={image}
                className="w-full 2xl:w-[290.4px] h-full 2xl:h-300.4px transition-opacity hover:opacity-80"
              >
                <Image image={image} index={index} />
              </div>
            )
          ))}

            <div className="w-full h-full flex items-center justify-center bg-white m-1">
              <label htmlFor="imageUpload" className="w-[152px] sm:w-[290.4px] h-[160px] sm:h-[300.4px] flex flex-col justify-center items-center">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <img src="/add.png" alt="Add New Image" className="mb-2 object-contain cursor-pointer" />
                <p className="text-gray-600 text-sm font-medium">Add New Image</p>
              </label>
            </div>
          </div>
        </div>
      </DndProvider>
    );
  };
  
  export default Gallery;