if [ ! -d dist/ ]; then
    echo "Expected dist/ directory does not exist.  See status below:"
    ls -la ./
    exit 1
fi
if [ "$(git diff --ignore-space-at-eol --text dist/ | wc -l)" -gt "0" ]; then
    echo "Detected uncommitted changes after build. See status below:"
    git diff --ignore-space-at-eol --text dist/
    exit 1
fi
