/*
  Warnings:

  - You are about to drop the `_AlbumFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArtistFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TrackFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AlbumFavorites" DROP CONSTRAINT "_AlbumFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlbumFavorites" DROP CONSTRAINT "_AlbumFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistFavorites" DROP CONSTRAINT "_ArtistFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistFavorites" DROP CONSTRAINT "_ArtistFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_TrackFavorites" DROP CONSTRAINT "_TrackFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_TrackFavorites" DROP CONSTRAINT "_TrackFavorites_B_fkey";

-- DropTable
DROP TABLE "_AlbumFavorites";

-- DropTable
DROP TABLE "_ArtistFavorites";

-- DropTable
DROP TABLE "_TrackFavorites";

-- CreateTable
CREATE TABLE "FavoritesOnArtists" (
    "id" TEXT NOT NULL,
    "favoritesId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "FavoritesOnArtists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritesOnAlbums" (
    "id" TEXT NOT NULL,
    "favoritesId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "FavoritesOnAlbums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritesOnTracks" (
    "id" TEXT NOT NULL,
    "favoritesId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "FavoritesOnTracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoritesOnArtists_favoritesId_artistId_key" ON "FavoritesOnArtists"("favoritesId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoritesOnAlbums_favoritesId_albumId_key" ON "FavoritesOnAlbums"("favoritesId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoritesOnTracks_favoritesId_trackId_key" ON "FavoritesOnTracks"("favoritesId", "trackId");

-- AddForeignKey
ALTER TABLE "FavoritesOnArtists" ADD CONSTRAINT "FavoritesOnArtists_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesOnArtists" ADD CONSTRAINT "FavoritesOnArtists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesOnAlbums" ADD CONSTRAINT "FavoritesOnAlbums_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesOnAlbums" ADD CONSTRAINT "FavoritesOnAlbums_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesOnTracks" ADD CONSTRAINT "FavoritesOnTracks_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesOnTracks" ADD CONSTRAINT "FavoritesOnTracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
