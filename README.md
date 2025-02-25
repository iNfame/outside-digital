dataset
https://gist.github.com/iNfame/c7999e425e17b492284e137cda647ffd

### setup
1. git clone
2. npm i
3. download dataset into ./data
4. setup .env
5. run `npx prisma generate`
6. run `npx prisma migrate dev`
7. if needed, run `npx prisma db seed`

### run

dev:
`npm run start:dev`

prod:
`npm run start:prod`

docker:
`docker build -t outside-digital-test .`\
`docker run --env-file .env -d -p 3001:3001 outside-digital-test`

### net benchmark
Since I'm located in the US and my data-center is in Germany, I was confused
with the execution time. So there is a small gpt-generated method here to check latency:
> http://127.0.0.1:3001/benchmark 

It proves that nothing is wrong with the code and it's just a ping between US and EU
