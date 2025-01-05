import React, { useState, useRef } from 'react';
import { Typography, Modal, Card } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Movie } from '../interface/movie.interface';
import { getMovieCardImageUrl, noImageUrl, getVideoUrl } from '../apis';
import { Link } from 'react-router-dom';

export const VideoCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const imageUrl = movie.backdrop_path
    ? getMovieCardImageUrl(movie.backdrop_path)
    : noImageUrl;

  const handleOpenModal = () => {
    const videoUrl = movie.trailers?.length
      ? getVideoUrl(movie.trailers[0].key)
      : '';
    setVideoUrl(videoUrl);
    if (iframeRef.current) {
      iframeRef.current.src = videoUrl;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVideoUrl('');
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
  };

  return (
    <>
      <Card
        hoverable
        cover={
          <div style={{ position: 'relative' }}>
            <img
              src={imageUrl}
              style={{
                width: '300px',
                height: '168px',
                borderRadius: '10px',
                objectFit: 'cover',
                transition: 'transform 0.5s ease-in-out',
              }}
            />
            <PlayCircleOutlined
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontSize: '48px',
                color: 'white',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        }
        style={{
          maxWidth: '300px',
          borderRadius: '10px',
          objectFit: 'cover',
          transition: 'transform 0.5s ease-in-out',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onClick={handleOpenModal}
      >
        <Card.Meta
          title={
            <Link to={`/movie/${movie.tmdb_id}`}>
              <Typography.Text
                style={{
                  display: 'block',
                  marginTop: 8,
                  fontSize: 16,
                  width: 300,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {movie.title}
              </Typography.Text>
            </Link>
          }
        />
      </Card>
      {videoUrl && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.3)',
            transition: 'filter 0.3s',
            filter: 'blur(0)',
            zIndex: 1,
          }}
        />
      )}
      <Modal
        title={movie.title}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width="80%"
        centered
        maskClosable={false}
      >
        <div
          style={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 Aspect Ratio
            width: '100%',
          }}
        >
          <iframe
            ref={iframeRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            src={videoUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>
    </>
  );
};
