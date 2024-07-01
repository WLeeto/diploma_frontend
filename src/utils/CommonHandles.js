import { endpoints } from "../api/endpoints";


export const handleDownload = async (file) => {
  const authJWT = localStorage.getItem('authToken');
  try {
    const response = await fetch(`${endpoints.GETUSERFILE}${file.id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JSON.parse(authJWT).access}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
};

export const formatISODate = (isoDateStr) => {
    const date = new Date(isoDateStr);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    const formattedDate = date.toLocaleDateString('ru-RU', options);

    return formattedDate;
}
