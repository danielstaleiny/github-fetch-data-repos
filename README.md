# github-fetch-data-repos
fetch info about project to analyze data later. get stars, language, contributor size

to merge data files run 
```shell
cat data/data-* > raw_dataset.csv
```

to remove duplicates run 
-u unique
-o output file
```shell
sort -u -o uniq.csv raw_dataset.csv
```

to order them based on stars run
-g general numeric value sort
-r reversed order (desc)
-t separator ","
-k3 by 3th column, starts with k1 
-o output file
```shell
sort -gr -t , -k3 -o dataset.csv uniq.csv
```
