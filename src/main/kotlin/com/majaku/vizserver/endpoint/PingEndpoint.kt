package com.majaku.vizserver.endpoint

import com.majaku.viz.common.dto.Ping
import com.majaku.vizserver.repository.PingRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType.APPLICATION_JSON_VALUE
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("ping")
@CrossOrigin
class PingEndpoint

    @Autowired
    constructor(private val pingRepository: PingRepository, private val simpMessagingTemplate : SimpMessagingTemplate) {

    init {
        simpMessagingTemplate.defaultDestination = "/"
    }

    @PostMapping("/", consumes = [APPLICATION_JSON_VALUE])
    public fun createPing(@RequestBody ping: Ping): ResponseEntity<Void> {
        pingRepository.addPing(ping.destServiceName, ping)
        simpMessagingTemplate.convertAndSend("/topic/ping", ping);
        return ResponseEntity.ok().build()
    }

    @GetMapping("/")
    public fun getPings(): ResponseEntity<Map<String, List<Ping>>> {
        return ResponseEntity.ok(pingRepository.getPings())
    }
}