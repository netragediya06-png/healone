import API from "./api";

const BASE = "/yoga";

/* =========================================
   CREATE YOGA (SPECIALIST)
========================================= */

export const createYoga = async (yogaData: { [x: string]: string | Blob; }) => {

  const formData = new FormData();

  Object.keys(yogaData).forEach((key) => {

    if (
      key === "benefits" ||
      key === "steps" ||
      key === "cautions" ||
      key === "tags"
    ) {
      formData.append(key, JSON.stringify(yogaData[key]));
    } else {
      formData.append(key, yogaData[key]);
    }

  });

  const res = await API.post(
    `${BASE}/specialist`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;
};



/* =========================================
   GET MY YOGA (SPECIALIST)
========================================= */

export const getMyYoga = async () => {

  const res = await API.get(`${BASE}/my`);

  return res.data;

};



/* =========================================
   UPDATE YOGA
========================================= */

export const updateYoga = async (id: any, yogaData: { [x: string]: string | Blob; }) => {

  const formData = new FormData();

  Object.keys(yogaData).forEach((key) => {

    if (
      key === "benefits" ||
      key === "steps" ||
      key === "cautions" ||
      key === "tags"
    ) {
      formData.append(key, JSON.stringify(yogaData[key]));
    } else {
      formData.append(key, yogaData[key]);
    }

  });

  const res = await API.put(
    `${BASE}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;

};



/* =========================================
   DELETE YOGA
========================================= */

export const deleteYoga = async (id: any) => {

  const res = await API.delete(`${BASE}/${id}`);

  return res.data;

};



/* =========================================
   GET APPROVED YOGA (PUBLIC)
========================================= */

export const getApprovedYoga = async () => {

  const res = await API.get(`${BASE}/approved`);

  return res.data;

};



/* =========================================
   SEARCH YOGA
========================================= */

export const searchYoga = async (tag: any) => {

  const res = await API.get(`${BASE}/search?tag=${tag}`);

  return res.data;

};


/* =========================================
   ❤️ WISHLIST YOGA (HEART)
========================================= */
export const toggleWishlistYoga = async (yogaId: any) => {
  const res = await API.post(`/users/wishlist/yoga`, { yogaId });
  return res.data;
};

/* =========================================
   🔖 SAVE YOGA (BOOKMARK)
========================================= */
export const toggleSaveYoga = async (yogaId: any) => {
  const res = await API.post(`/users/save/yoga`, { yogaId });
  return res.data;
};

/* =========================================
   GET SAVED YOGA
========================================= */
export const getSavedYoga = async () => {
  const res = await API.get(`/users/saved-yoga`);
  return res.data;
};

/* =========================================
   GET WISHLIST YOGA
========================================= */
export const getWishlistYoga = async () => {
  const res = await API.get(`/users/wishlist-yoga`);
  return res.data;
};