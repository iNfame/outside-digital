### Intro

Tested on Node 22.14LTS
 
method: https://infame.aivus.app/events?startDate=2023-12-13T00:11:00Z&endDate=2023-12-21T00:15:00Z&vehicleId=sprint-4
db net benchmark: https://infame.aivus.app/benchmark 

dataset
https://gist.github.com/infame/c7999e425e17b492284e137cda647ffd

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
