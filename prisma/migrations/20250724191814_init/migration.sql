/*
  Warnings:

  - The primary key for the `Default` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content_description" TEXT NOT NULL,
    "learning_path_id" TEXT NOT NULL,
    CONSTRAINT "Category_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "LearningPath" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    CONSTRAINT "Step_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    CONSTRAINT "Goal_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "Step" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Default" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Default" ("id") SELECT "id" FROM "Default";
DROP TABLE "Default";
ALTER TABLE "new_Default" RENAME TO "Default";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
