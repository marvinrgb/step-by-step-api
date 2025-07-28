-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content_description" TEXT NOT NULL,
    "learning_path_id" TEXT NOT NULL,
    CONSTRAINT "Category_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "LearningPath" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("content_description", "description", "id", "learning_path_id", "name") SELECT "content_description", "description", "id", "learning_path_id", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_LearningPath" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budged_type" TEXT NOT NULL DEFAULT 'normal'
);
INSERT INTO "new_LearningPath" ("description", "id", "name") SELECT "description", "id", "name" FROM "LearningPath";
DROP TABLE "LearningPath";
ALTER TABLE "new_LearningPath" RENAME TO "LearningPath";
CREATE TABLE "new_Step" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    CONSTRAINT "Step_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Step" ("category_id", "description", "id", "name") SELECT "category_id", "description", "id", "name" FROM "Step";
DROP TABLE "Step";
ALTER TABLE "new_Step" RENAME TO "Step";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
