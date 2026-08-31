import dotenv from "dotenv";
import mongoose from "mongoose";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

dotenv.config({ path: ".env.local" });

const rl = readline.createInterface({
  input,
  output,
});

type EntityType =
  | "event"
  | "hero"
  | "historicalPersonality";

type ExistingImage = {
  _id: string;
  imageId: string;
  title: string;
  url: string;
  altText: string | null;
  imageType: string | null;
  description: string | null;
};

type NewImage = {
  cloudinaryUrl: string;
  altText: string | null;
  caption: string | null;
  verified: boolean;
};

type ImageResult = {
  entityType: EntityType;
  entityName: string;

  existingImagesFound: ExistingImage[];
  selectedExistingImageIds: string[];

  newImages: NewImage[];

  totalSelectedImages: number;

  verified: boolean;
  verificationNote: string;
};

function normalizeEntityType(
  value: string
): EntityType | null {
  const v = value.trim().toLowerCase();

  if (v === "1" || v === "event") {
    return "event";
  }

  if (v === "2" || v === "hero") {
    return "hero";
  }

  if (
    v === "3" ||
    v === "historical personality" ||
    v === "historicalpersonality" ||
    v === "hist per"
  ) {
    return "historicalPersonality";
  }

  return null;
}

async function askYesNo(
  question: string
): Promise<boolean> {
  while (true) {
    const answer = (
      await rl.question(question)
    )
      .trim()
      .toLowerCase();

    if (
      answer === "y" ||
      answer === "yes"
    ) {
      return true;
    }

    if (
      answer === "n" ||
      answer === "no"
    ) {
      return false;
    }

    console.log(
      "Please enter y or n."
    );
  }
}

async function askRequired(
  question: string
): Promise<string> {
  while (true) {
    const value = (
      await rl.question(question)
    ).trim();

    if (value.length > 0) {
      return value;
    }

    console.log(
      "This field is required."
    );
  }
}

async function askOptional(
  question: string
): Promise<string | null> {
  const value = (
    await rl.question(question)
  ).trim();

  return value.length > 0
    ? value
    : null;
}

function escapeRegex(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

function buildSearchTerms(
  entityName: string
): string[] {
  const normalized = entityName
    .trim()
    .replace(/\s+/g, " ");

  const terms = new Set<string>();

  terms.add(normalized);

  return Array.from(terms);
}

async function searchExistingImages(
  entityName: string
): Promise<ExistingImage[]> {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB database is not connected."
    );
  }

  const collection =
    db.collection("images");

  const terms =
    buildSearchTerms(entityName);

  const orConditions: Record<
    string,
    unknown
  >[] = [];

  for (const term of terms) {
    const regex = new RegExp(
      escapeRegex(term),
      "i"
    );

    orConditions.push(
      { title: regex },
      { altText: regex },
      { description: regex },
      { url: regex }
    );
  }

  const documents =
    await collection
      .find(
        {
          $or: orConditions,
        },
        {
          projection: {
            imageId: 1,
            title: 1,
            url: 1,
            altText: 1,
            imageType: 1,
            description: 1,
          },
        }
      )
      .limit(20)
      .toArray();

  return documents.map(
    (document) => ({
      _id: String(
        document._id
      ),
      imageId:
        typeof document.imageId ===
        "string"
          ? document.imageId
          : "",
      title:
        typeof document.title ===
        "string"
          ? document.title
          : "",
      url:
        typeof document.url ===
        "string"
          ? document.url
          : "",
      altText:
        typeof document.altText ===
        "string"
          ? document.altText
          : null,
      imageType:
        typeof document.imageType ===
        "string"
          ? document.imageType
          : null,
      description:
        typeof document.description ===
        "string"
          ? document.description
          : null,
    })
  );
}

function isValidCloudinaryUrl(
  value: string
): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      (
        url.hostname ===
          "res.cloudinary.com" ||
        url.hostname.endsWith(
          ".cloudinary.com"
        )
      )
    );
  } catch {
    return false;
  }
}

async function collectNewImage(
  imageNumber: number
): Promise<NewImage> {
  console.log(`
----------------------------------------
NEW IMAGE ${imageNumber}
----------------------------------------
`);

  let cloudinaryUrl: string;

  while (true) {
    cloudinaryUrl =
      await askRequired(
        "CLOUDINARY URL > "
      );

    if (
      isValidCloudinaryUrl(
        cloudinaryUrl
      )
    ) {
      break;
    }

    console.log(
      "Please enter a valid Cloudinary HTTPS URL."
    );
  }

  const altText =
    await askOptional(
      "ALT TEXT (optional) > "
    );

  const caption =
    await askOptional(
      "CAPTION (optional) > "
    );

  const verified =
    await askYesNo(
      "Is this image information verified/correct? (y/n) > "
    );

  return {
    cloudinaryUrl,
    altText,
    caption,
    verified,
  };
}

async function selectExistingImages(
  images: ExistingImage[],
  entityType: EntityType
): Promise<string[]> {
  if (images.length === 0) {
    return [];
  }

  const maxImages =
    entityType === "event"
      ? images.length
      : 1;

  while (true) {
    const answer =
      await rl.question(
        entityType === "event"
          ? "SELECT IMAGE NUMBER(S) (e.g. 1,3) or 0 for none > "
          : "SELECT IMAGE NUMBER (1) or 0 for none > "
      );

    const value =
      answer.trim();

    if (value === "0") {
      return [];
    }

    const parts = value
      .split(",")
      .map((part) =>
        Number(part.trim())
      );

    if (
      parts.some(
        (number) =>
          !Number.isInteger(number)
      )
    ) {
      console.log(
        "Please enter valid image numbers."
      );
      continue;
    }

    const unique =
      Array.from(
        new Set(parts)
      );

    if (
      unique.length > maxImages
    ) {
      console.log(
        entityType === "event"
          ? `You can select up to ${maxImages} images from the displayed results.`
          : "Heroes and Historical Personalities can have only 1 image."
      );
      continue;
    }

    if (
      unique.some(
        (number) =>
          number < 1 ||
          number > images.length
      )
    ) {
      console.log(
        "One or more image numbers are invalid."
      );
      continue;
    }

    return unique.map(
      (number) =>
        images[number - 1].imageId
    );
  }
}

async function main() {
  console.log(`
========================================
VEERBHARAT IMAGE VERIFICATION
========================================
`);

  console.log(`
Entity type:
  1. Event
  2. Hero
  3. Historical Personality
`);

  let entityType:
    | EntityType
    | null = null;

  while (!entityType) {
    const value =
      await rl.question(
        "TYPE > "
      );

    entityType =
      normalizeEntityType(
        value
      );

    if (!entityType) {
      console.log(
        "Please enter 1, 2, or 3."
      );
    }
  }

  const entityName =
    await askRequired(
      "ENTITY NAME > "
    );

  console.log(`
========================================
CONNECTING TO DATABASE
========================================
`);

  /*
   * IMPORTANT:
   * Import mongoose.ts only after
   * dotenv has loaded .env.local.
   */
  const {
    connectDB,
  } = await import(
    "../../../src/lib/mongoose"
  );

  await connectDB();

  console.log(`
========================================
SEARCHING EXISTING IMAGES
========================================
`);

  const existingImages =
    await searchExistingImages(
      entityName
    );

  if (
    existingImages.length === 0
  ) {
    console.log(
      "\nNO RELEVANT EXISTING IMAGE FOUND."
    );
  } else {
    console.log(
      `\nFOUND ${existingImages.length} POSSIBLE IMAGE(S):`
    );

    existingImages.forEach(
      (image, index) => {
        console.log(`
IMAGE ${index + 1}
  imageId     : ${image.imageId}
  title       : ${image.title || "NONE"}
  url         : ${image.url || "NONE"}
  altText     : ${image.altText ?? "NONE"}
  imageType   : ${image.imageType ?? "NONE"}
  description : ${
    image.description ?? "NONE"
  }
`);
      }
    );
  }

  let selectedExistingImageIds:
    string[] = [];

  if (
    existingImages.length > 0
  ) {
    const useExisting =
      await askYesNo(
        "Is one or more of these images relevant to this entity? (y/n) > "
      );

    if (useExisting) {
      selectedExistingImageIds =
        await selectExistingImages(
          existingImages,
          entityType
        );

      if (
        selectedExistingImageIds.length >
        0
      ) {
        console.log(`
========================================
EXISTING IMAGE(S) SELECTED
========================================
`);

        for (const imageId of
          selectedExistingImageIds) {
          const image =
            existingImages.find(
              (item) =>
                item.imageId ===
                imageId
            );

          console.log(
            `IMAGE ID : ${imageId}`
          );

          if (image) {
            console.log(
              `TITLE    : ${image.title}`
            );
            console.log(
              `URL      : ${image.url}`
            );
          }
        }
      } else {
        console.log(
          "\nNO EXISTING IMAGE SELECTED."
        );
      }
    } else {
      console.log(
        "\nNO EXISTING IMAGE WILL BE LINKED."
      );
    }
  }

  /*
   * Existing image selected:
   * For Hero / Historical Personality
   * we do not ask for another image
   * unless the operator explicitly
   * chooses not to use the existing one.
   */

  const selectedCount =
    selectedExistingImageIds.length;

  let newImages: NewImage[] = [];

  if (
    entityType === "hero" ||
    entityType ===
      "historicalPersonality"
  ) {
    if (selectedCount === 1) {
      console.log(`
========================================
IMAGE COMPLETE
========================================
`);

      console.log(
        "Existing image will be linked."
      );
    } else {
      const addNew =
        await askYesNo(
          "Do you want to add a new image? (y/n) > "
        );

      if (addNew) {
        newImages.push(
          await collectNewImage(1)
        );
      }
    }
  } else {
    /*
     * Event supports multiple images.
     */

    const addNew =
      await askYesNo(
        "Do you want to add a new image? (y/n) > "
      );

    if (addNew) {
      while (true) {
        newImages.push(
          await collectNewImage(
            newImages.length + 1
          )
        );

        const another =
          await askYesNo(
            "Do you want to add another new image? (y/n) > "
          );

        if (!another) {
          break;
        }
      }
    }
  }

  const totalSelectedImages =
    selectedExistingImageIds.length +
    newImages.length;

  console.log(`
========================================
IMAGE VERIFICATION
========================================
`);

  console.log(
    `ENTITY TYPE : ${entityType}`
  );

  console.log(
    `ENTITY NAME : ${entityName}`
  );

  console.log("");

  if (
    selectedExistingImageIds.length >
    0
  ) {
    console.log(
      "EXISTING IMAGES:"
    );

    selectedExistingImageIds.forEach(
      (imageId) => {
        const image =
          existingImages.find(
            (item) =>
              item.imageId ===
              imageId
          );

        console.log(
          `  ${imageId} - ${
            image?.title ?? "NONE"
          }`
        );
      }
    );
  } else {
    console.log(
      "EXISTING IMAGES: NONE"
    );
  }

  if (newImages.length > 0) {
    console.log(
      "\nNEW IMAGES:"
    );

    newImages.forEach(
      (image, index) => {
        console.log(`
  NEW IMAGE ${index + 1}
    URL     : ${image.cloudinaryUrl}
    ALT     : ${image.altText ?? "NONE"}
    CAPTION : ${image.caption ?? "NONE"}
`);
      }
    );
  } else {
    console.log(
      "\nNEW IMAGES: NONE"
    );
  }

  console.log(
    `\nTOTAL SELECTED IMAGES : ${totalSelectedImages}`
  );

  const verified =
    await askYesNo(
      "\nIs this image selection verified/correct? (y/n) > "
    );

  const result: ImageResult = {
    entityType,
    entityName,

    existingImagesFound:
      existingImages,

    selectedExistingImageIds,

    newImages,

    totalSelectedImages,

    verified,

    verificationNote:
      totalSelectedImages === 0
        ? "No image selected by data-entry operator."
        : "Image information verified by data-entry operator.",
  };

  console.log(`
========================================
IMAGE VERIFICATION RESULT
========================================
`);

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(`
========================================
IMAGE VERIFICATION FAILED
========================================
`);

    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();

    if (
      mongoose.connection.readyState !==
      0
    ) {
      await mongoose.connection.close();
    }
  });