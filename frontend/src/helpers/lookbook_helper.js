export function parseSearchParamValue(value) {
  const json = decodeURIComponent(value);
  return JSON.parse(json);
}

export function buildSearchParamValue(data) {
  const str = JSON.stringify(data);
  return encodeURIComponent(str);
}

function shouldEncodeValue(value) {
  return typeof value === "object" && !Array.isArray(value);
}

export function updateIframeSrc(iframe, params) {
  if (iframe) {
    const url = new URL(iframe.src);

    for (const [key, value] of Object.entries(params)) {
      if (key === "timestamp" && url.search.includes("timestamp")) {
        url.searchParams.set("timestamp", value);
      } else {
        const encodedValue = shouldEncodeValue(value)
          ? buildSearchParamValue(value)
          : value;
        if (url.searchParams.has(key)) {
          url.searchParams.set(key, encodedValue);
        } else {
          url.searchParams.append(key, encodedValue);
        }
      }
    }

    iframe.src = url.toString();
  } else {
    console.error("Iframe element not found.");
  }
}
