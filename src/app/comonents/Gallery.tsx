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
    '/image-11.jpeg'
  ]);

  // Make the last image the initially featured image
  const initialFeaturedImage = images[images.length - 1];

  const [featuredImage, setFeaturedImage] = useState(initialFeaturedImage);

  const moveImage = (dragIndex, hoverIndex) => {
    const updatedImages = [...images];
    const [draggedImage] = updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, draggedImage);
    setImages(updatedImages);
  };

  const handleFeatureImage = (image) => {
    // Set the dragged image as the featured image
    setFeaturedImage(image);
  };

  const Image = ({ image, index }) => {
    const [, ref] = useDrop({
      accept: 'IMAGE',
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveImage(draggedItem.index, index);
          draggedItem.index = index;
          // Set the dragged image as the featured image
          setFeaturedImage(images[draggedItem.index]);
        }
      },
    });

    const [{ isDragging }, refDrag] = useDrag({
      type: 'IMAGE',
      item: { type: 'IMAGE', index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const opacity = isDragging ? 0.5 : 1;

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
        }}
        onClick={() => handleFeatureImage(image)}
      >
        <img src={image} alt={`Image ${index}`} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  };

  useEffect(() => {
    // Store the current image order in local storage
    localStorage.setItem('imageOrder', JSON.stringify(images));
  }, [images]);

  // Restore the image order from local storage when the component mounts
  useEffect(() => {
    const storedImageOrder = JSON.parse(localStorage.getItem('imageOrder'));
    if (storedImageOrder) {
      setImages(storedImageOrder);
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Image Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="relative row-span-2 col-span-2">
            {featuredImage && (
              <div className="w-full h-full m-1">
                <img src={featuredImage} alt="Featured" className="w-full h-full" />
              </div>
            )}
          </div>
          {images.slice(0, -1).map((image, index) => (
            <div key={index} className="relative row-span-1 col-span-1 w-full h-full transition-opacity hover:opacity-80">
              <Image image={image} index={index} />
            </div>
          ))}
        </div>
        <p className="mt-4">Drag and drop images to change their position in the gallery.</p>
      </div>
    </DndProvider>
  );
};

export default Gallery;
