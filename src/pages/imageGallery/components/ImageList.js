import React from "react";
import { Card, Col, Row } from "antd";

const { Meta } = Card;

const ImageList = (props) => { 
    const { images = [], handleImageClick, isDrawerVisible } = props;
    return (
        <Row
            style={{
              width: isDrawerVisible ? "70%" : "100%",
              overflowY: "auto", // Enable scrolling in the image grid
              margin: 0,
            }}
            gutter={[16, 16]}
        >
        {images.map((image) => (
            <Col key={image.id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card
                hoverable
                cover={
                <img
                    alt={`Image by ${image.author}`}
                    src={`https://picsum.photos/id/${image.id}/300/200`}
                    onClick={() => handleImageClick(image.id)}
                />
                }
            >
                <Meta title={`By ${image.author}`} />
            </Card>
            </Col>
        ))}
        </Row>
    );
}

export default ImageList;