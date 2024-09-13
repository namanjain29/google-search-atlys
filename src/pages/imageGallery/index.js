import React, { useEffect, useState } from "react";
import { Spin, Modal, message } from "antd";
import PagePagination from "../../common/Pagination";
import axios from "axios";
import ImageList from "./components/ImageList";
import constants from '../../constants';
import { CloseOutlined } from "@ant-design/icons";
import { createUseStyles } from "react-jss";

// Define JSS styles using createUseStyles
const useStyles = createUseStyles({
  imageGalleryContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  contentWrapper: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: "60px", // Ensure space for the fixed pagination
  },
  paginationContainer: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: "10px 0",
    boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  imageGallery: {
    overflowY: "scroll",
    height: "90vh",
    padding: '10px',
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  imageDrawer: {
    width: "30%",
    position: "fixed",
    right: 0,
    top: 0,
    height: "100vh",
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  closeButton: {
    margin: '10px',
    cursor: 'pointer',
  },
  modalImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }
});

const ImageGallery = () => {
  const classes = useStyles();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [imageDetails, setImageDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
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

    fetchImages(currentPage);
  }, [currentPage, pageSize]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleImageClick = async (id) => {
    try {
      const imageDetailUrl = constants.URLS.imageDetails(id);
      const response = await axios.get(imageDetailUrl);
      setImageDetails(response.data);
      if (isMobileView) {
        setIsModalVisible(true);
      } else {
        setIsDrawerVisible(true);
      }
    } catch (error) {
      message.error("Failed to fetch image details");
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
    <div className={classes.imageGalleryContainer}>
      <div className={classes.imageGallery}>
        <h2 style={{ padding: "10px 10px" }}>Image Search Page</h2>
        {loading ? (
          <div className={classes.spinnerContainer}>
            <Spin tip="Loading..." />
          </div>
        ) : (
          <ImageList
            images={images}
            handleImageClick={handleImageClick}
            isDrawerVisible={isDrawerVisible}
          />
        )}
      </div>

      <div className={classes.paginationContainer}>
        <PagePagination
          current={currentPage}
          pageSize={pageSize}
          totalContent={totalImages}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
        />
      </div>

      {isDrawerVisible && (
        <div className={classes.imageDrawer}>
          <CloseOutlined onClick={handleDrawerClose} className={classes.closeButton} />
          {imageDetails ? (
            <img
              alt={imageDetails.author}
              src={imageDetails.download_url}
              className={classes.modalImage}
            />
          ) : (
            <Spin tip="Loading..." />
          )}
        </div>
      )}

      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
      >
        {imageDetails ? (
          <img
            alt={imageDetails.author}
            src={imageDetails.download_url}
            className={classes.modalImage}
          />
        ) : (
          <Spin tip="Loading..." />
        )}
      </Modal>
    </div>
  );
};

export default ImageGallery;
