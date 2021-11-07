package com.bestappsintown.vizserver.repository

import com.bestappsintown.visualizer.common.dto.Ping
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class PingRepository {
    private val pingMap: MutableMap<String, MutableList<Ping>> = HashMap()

    fun addPing(service: String, ping: Ping) {
        if (pingMap[service] == null) {
            pingMap[service] = Collections.synchronizedList(ArrayList())
        }
        pingMap[service]?.add(ping)
    }

    fun getPings(): Map<String, List<Ping>> {
        return pingMap
    }
}
