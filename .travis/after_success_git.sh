#!/usr/bin/env bash

echo "GIT"
echo "TRAVIS_BRANCH=$TRAVIS_BRANCH"
echo "TRAVIS_BUILD_DIR=$TRAVIS_BUILD_DIR"
echo "TRAVIS_PULL_REQUEST_BRANCH=$TRAVIS_PULL_REQUEST_BRANCH"

if [ -n "$GH_TOKEN" ]; then
	echo "✓ GH Token is here"
	cd "$TRAVIS_BUILD_DIR"
	echo "✓ Move to Travis build dir"
	if [ "$TRAVIS_PULL_REQUEST" != 'false' ]; then
	    git fetch origin $TRAVIS_PULL_REQUEST_BRANCH:$TRAVIS_PULL_REQUEST_BRANCH --depth 1
		git checkout $TRAVIS_PULL_REQUEST_BRANCH
		echo "✓ Checkout $TRAVIS_PULL_REQUEST_BRANCH"

		if [[ "$TALEND_COMMIT_MSG" =~ 'icon' ]]; then
			git add packages/components/src
			git add packages/icons/src/svg
			git -c user.name="travis" -c user.email="travis" commit -m "test(ci): optimize icons [skip ci]"
			echo "✓ Commit optimized icons and components snapshots to $TRAVIS_PULL_REQUEST_BRANCH"
		fi

#		git add packages/theme/screenshots/
#		git add packages/components/screenshots/
#		echo "git status"
#		git status
#		git -c user.name="travis" -c user.email="travis" commit -m "test(ci): update screenshots [skip ci]"
#		echo "✓ Commit updated screenshots to $TRAVIS_PULL_REQUEST_BRANCH"

		git add output/
		git -c user.name="travis" -c user.email="travis" commit -m "test(ci): update code style outputs [skip ci]"
		echo "✓ Commit updated lint output to $TRAVIS_PULL_REQUEST_BRANCH"

		find packages/*/src -name "*.scss" -o -name "*.js" | xargs git add
		git -c user.name="travis" -c user.email="travis" commit -m "test(ci): prettier [skip ci]"
		echo "✓ Commit prettified files to $TRAVIS_PULL_REQUEST_BRANCH"

		git push -q https://build-travis-ci:$GH_TOKEN@github.com/Talend/ui $TRAVIS_PULL_REQUEST_BRANCH
		echo "✓ Push to $TRAVIS_PULL_REQUEST_BRANCH"
	fi
	cd "$TRAVIS_BUILD_DIR"
	echo "✓ Move to Travis build dir"
fi
