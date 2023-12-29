import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export async function getStaticPaths() {
  const res = await fetch("https://jsonplaceholder.typicode.com/albums");
  const albums = await res.json();
  const albumIds = albums.map((album) => {
    return { params: { albumId: album.id.toString() } };
  });
  return {
    paths: albumIds,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { albumId } = params;
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`
  );
  const photos = await res.json();
  return { props: { photos } };
}

const AlbumDetail = ({ photos }) => {
  const photosPerPage = 12; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(photos.length / photosPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span
          key={i}
          onClick={() => handlePageClick(i)}
          className={`mx-2 cursor-pointer ${
            currentPage === i ? "font-bold" : ""
          }`}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  };
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  return (
    <div className="p-6 overflow-hidden ">
      <h1 className="text-center text-xl font-bold md:text-3xl md:mt-12 mb-10">
        Album Detail
      </h1>
       {/* Back Button */}
       <Link href="/">
        <p className="text-blue-500 mb-4 block text-center hover:underline">
          &larr; Back to Albums
        </p>
      </Link>
      {/* Card Photo */}
      <div className="flex flex-wrap justify-center ">
        {currentPhotos.map((photo) => (
          <div
            key={photo.id}
            className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 overflow-hidden"
          >
            <Image
              src={photo.thumbnailUrl}
              alt={photo.title}
              width={150}
              height={150}
              className="mx-auto mb-2 h-40 rounded-lg shadow-md"
            />
            <h2 className="text-center text-lg font-semibold">{photo.title}</h2>
            <a
              className="bg-blue-500 mt-auto hover:bg-blue-800 text-white p-3 text-center transition-all duration-500 block rounded-md"
              href={photo.url}
            >
              View
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-40">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mr-2 text-white bg-blue-500 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <div className="flex items-center space-x-2">{getPageNumbers()}</div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 ml-2 text-white bg-blue-500 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AlbumDetail;
