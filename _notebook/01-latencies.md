---
title:  "Latencies"
permalink: /notebook/latencies/
excerpt: "Important computer latencies"
last_modified_at: 2019-02-14T22:20:31-04:00
---
| Type                                | Latency (order of mag - approx)   |
| ------------------------------------|:---------------------------------:|
| Cpu cycle (Intel Xeon Gold @3.2 GHz)|              0.31 ns               |
| L1 cache reference/hit              |              1   ns               |
| Branch Mispredict                   |              3   ns               |
| L2 cache reference/hit              |              4   ns               |
| Mutex lock/unlock                   |              17  ns               |
| Main Memory Reference               |              100 ns               |
| Read 1MB sequentially  from memory  |              3   μs               |
| Read 1MB sequentially from NVMe SSD |              200 μs               |
| Read 1MB sequentially from SSD      |              2   ms               |
| Read 1MB sequentially from disk     |              5   ms               |
| NVMe SSD random read  (4KB)         |              200 μs               |
| SSD random read  (4KB)              |              500 μs               |
| NVMe SSD random read  (4KB)         |              500 μs               |
| Random disk access (seek + rotation)|              10  ms               |
| Send  4KB over 10Gbps  ethernet     |              10  μs               |
| Write 4KB randomly to NVMe SSD      |              30  μs               |
| Write 4KB randomly to SSD           |              500 μs               |
| Round trip within  same Datacenter  |              500 μs               |
| Packet round trip CA to Netherlands |              150 ms               |

**Source**: Eliot Eshelman's [gist](https://gist.github.com/eshelman).