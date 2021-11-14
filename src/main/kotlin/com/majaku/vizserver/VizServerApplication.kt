package com.majaku.vizserver

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class VizServerApplication

fun main(args: Array<String>) {
	runApplication<VizServerApplication>(*args)
}
