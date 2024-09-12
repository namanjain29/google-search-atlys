import React, { useEffect, useState } from "react";
import { Spin, Modal } from "antd";
import PagePagination from "../../common/Pagination";
import axios from "axios";
import "./index.css"; // Use this for any additional custom styling
import ImageList from "./components/ImageList";
import constants from '../../constants'

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [imageDetails, setImageDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false); // To detect mobile or desktop view
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage, pageSize]);

  const fetchImages = async (page) => {
    setLoading(true);
    try {
      const imageListUrl = constants.URLS.imageList(page, pageSize);
      const response = await axios.get(imageListUrl);
      setImages(response.data);
      setTotalImages(1000); // Assuming there are 1000 total images
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
    setLoading(false);
  };

  // Detect screen size for mobile vs desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768); // Mobile view if screen width <= 768px
    };
    handleResize(); // Call on mount to set the initial value
    window.addEventListener("resize", handleResize); // Listen for window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  const handleImageClick = async (id) => {
    try {
      const imageDetailUrl = constants.URLS.imageDetails(id);
      const response = await axios.get(imageDetailUrl);
      setImageDetails(response.data);
      if (isMobileView) {
        setIsModalVisible(true); // Open modal for mobile
      } else {
        setIsDrawerVisible(true); // Open drawer for desktop
      }
    } catch (error) {
      console.error("Failed to fetch image details:", error);
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setImageDetails(null);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setImageDetails(null);
  };

  return (
    <div className="image-gallery-container">
      {/* Left Side Scrollable Image Grid */}
      <div className="image-gallery">
        <h2>Image Search Page</h2>
        {loading ? (
            <Spin tip="Loading..." />
        ) : (
            <ImageList
                images={images} 
                handleImageClick={handleImageClick}
                isDrawerVisible={isDrawerVisible}
            />
        )}
      </div>
      {/* Pagination */}
      <div className="pagination-container">
        <PagePagination
          current={currentPage}
          pageSize={pageSize}
          totalContent={totalImages}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          style={{ margin: "10px", textAlign: "center" }}
          />
      </div>

      {/* Image Drawer (Fixed) */}
      {isDrawerVisible && (
        <div
          className="image-drawer"
          style={{
            width: "30%",
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
            backgroundColor: "#fff",
            zIndex: 1000,
          }}
        >
          <button onClick={handleDrawerClose} style={{ margin: "10px" }}>
            Close
          </button>
          {imageDetails ? (
            <img
              alt={imageDetails.author}
              src={imageDetails.download_url}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <Spin tip="Loading..." />
          )}
        </div>
      )}
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
      >
        {imageDetails ? (
          <img
            alt={imageDetails.author}
            src={imageDetails.download_url}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <Spin tip="Loading..." />
        )}
      </Modal>
    </div>
  );
};

export default ImageGallery;
