import { useRouter } from "next/router";
import AlbumDetail from "./[albumId]";

const Album = () => {
  const router = useRouter();
  const { albumId } = router.query;

  return (
    <div>
      {albumId && <AlbumDetail albumId={albumId} />}
    </div>
  );
};

export default Album;
