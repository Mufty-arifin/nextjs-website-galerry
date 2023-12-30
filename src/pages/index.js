import Link from "next/link";
import { useState } from "react";

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch("https://jsonplaceholder.typicode.com/albums");
  const albums = await res.json();
  // Pass data to the page via props
  return { props: { albums } };
}

export default function Page({ albums }) {
  const albumsPerPage = 12; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(albums.length / albumsPerPage);

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
            currentPage === i ? "font-extrabold" : ""
          }`}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  };

  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);

  return (
    <div className="p-5 overflow-hidden" >
      <h1 className="text-4xl text-center text-white font-bold">HomePage</h1>

      {/* Card Album */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-5 md:pt-10 lg:p-16 place-items-center gap-5 h-[600px]">
        {currentAlbums.map((album) => (
          <div key={album.id}>
            <Link href={`/albums/${album.id}`} passHref>
              <div className="cursor-pointer">
                <div className="w-36 md:w-60 h-36 p-5 bg-white shadow-lg border-gray-200 rounded-lg dark:bg-gray-800 dar hover:-translate-y-2 ease-in-out transition-transform duration-300 ">
                  <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {album.id}
                  </h5>
                  <p className="mb-3 text-xs font-normal text-gray-500 dark:text-gray-400">
                    {album.title}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-[27rem] md:mt-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mr-2 text-white bg-blue-500 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <div className="flex items-center text-white space-x-2">{getPageNumbers()}</div>
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
}
