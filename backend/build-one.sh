if [ -z "$1" ]
then
  exit 0
fi

input_file="$1"
output_dir="dist"
output_file_no_dir=$(echo "$input_file" | sed -E "s/ts$/js/")
output_file="$output_dir/$output_file_no_dir"

stat "$input_file" > /dev/null || exit 1

npx esbuild "$input_file" --outfile="$output_file" --sourcemap --platform=node --format=cjs
