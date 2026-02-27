#!/bin/bash
mkdir -p public/assets/images
USER_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

dl() {
  echo "Downloading $2..."
  curl -L -A "$USER_AGENT" -e "https://dedicatedtechnical.com/" -o "public/assets/images/$1" "$2"
}

dl "hero-bg.jpg" "https://dedicatedtechnical.com/wp-content/uploads/2022/08/man-worker-fir-min.jpg"
dl "ac-duct.jpg" "https://dedicatedtechnical.com/wp-content/uploads/2022/07/ac-duct-clean.jpg"
dl "painting.jpg" "https://dedicatedtechnical.com/wp-content/uploads/2022/07/painting.jpg"
dl "kitchen.jpg" "https://dedicatedtechnical.com/wp-content/uploads/2022/07/Kitchen-Renovation.jpg"
dl "technician.jpg" "https://dedicatedtechnical.com/wp-content/uploads/2022/07/ac-technician-dubai.jpg"
dl "logo.png" "https://dedicatedtechnical.com/wp-content/uploads/2022/07/dedicated-technical-services-logo.png"

echo "Download complete. Checking file sizes:"
ls -lh public/assets/images/
