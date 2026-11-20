# mikemylonakis.com — Jekyll site on GitHub Pages.
# Pushing to master deploys. Run `just` to list recipes.

set dotenv-load

# Gemfile.lock needs Ruby >= 3.2; the rbenv 3.3.6 install works (see .ruby-version).
export PATH := env_var('HOME') + "/.rbenv/versions/3.3.6/bin:" + env_var('PATH')

site_url := "https://mikemylonakis.com"

default:
    @just --list

# Install gems
install:
    bundle install

# Serve locally with live reload on http://localhost:4000
serve:
    bundle exec jekyll serve --livereload

# Production build into _site (comments render only in production)
build:
    JEKYLL_ENV=production bundle exec jekyll build

# Run the tests of the page scripts (assets/js/mike)
test:
    node --test _tests/

# Remove build output and caches
clean:
    bundle exec jekyll clean

# Check links on the live site (or pass a local URL, e.g. http://localhost:4000)
links url=site_url:
    npx -y linkinator {{url}} --recurse --skip "linkedin|disqus|algolia|stackoverflow|cdn-cgi"

# Show what would go to the Algolia search index, without pushing
# (the plugin wants a key even for a dry run; fall back to the public search-only key)
algolia-dry:
    ALGOLIA_API_KEY="${ALGOLIA_API_KEY:-$(awk '/search_only_api_key/ {print $3}' _config.yml)}" JEKYLL_ENV=production bundle exec jekyll algolia --dry-run

# Push the search index to Algolia (needs ALGOLIA_API_KEY = admin key, in .env)
algolia:
    @test -n "${ALGOLIA_API_KEY:-}" || (echo "ALGOLIA_API_KEY is not set (put it in .env)" >&2; exit 1)
    JEKYLL_ENV=production bundle exec jekyll algolia

# Push to GitHub (deploys), then update the search index
publish:
    git push origin master
    just algolia
