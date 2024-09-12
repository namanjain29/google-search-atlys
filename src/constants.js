const URLS = {
    imageDetails: (id) => `https://picsum.photos/id/${id}/info`,
    imageList: (page, pageSize) => `https://picsum.photos/v2/list?page=${page}&limit=${pageSize}`
}

const constants = { URLS };

export default constants;