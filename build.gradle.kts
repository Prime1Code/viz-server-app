import com.github.gradle.node.npm.task.NpmTask
import org.gradle.api.JavaVersion.VERSION_11
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "2.5.6"
	id("io.spring.dependency-management") version "1.0.11.RELEASE"
	id("org.asciidoctor.jvm.convert") version "3.1.0"
	id("com.github.node-gradle.node") version "3.1.0"
	kotlin("jvm") version "1.5.21"
	kotlin("plugin.spring") version "1.5.21"
}

group = "com.bestappsintown"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = VERSION_11

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

node {
	download.set(false)
	version.set("16.7.0")
	npmVersion.set("7.20.3")
	workDir.set(file("${project.buildDir}/nodejs"))
	npmWorkDir.set(file("${project.buildDir}/npm"))
}

repositories {
	mavenCentral()
	mavenLocal()
}

val snippetsDir = file("build/generated-snippets").also { extra["snippetsDir"] = it }
extra["springBootAdminVersion"] = "2.5.2"

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-websocket")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("de.codecentric:spring-boot-admin-starter-client")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("com.squareup.okhttp3:okhttp:4.9.2")
	implementation("com.bestappsintown:vis-common:0.0.1-SNAPSHOT")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
	testImplementation("org.springframework.security:spring-security-test")
}

dependencyManagement {
	imports {
		mavenBom("de.codecentric:spring-boot-admin-dependencies:${property("springBootAdminVersion")}")
	}
}

tasks.withType<KotlinCompile> {
	dependsOn("copyWebApp")
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "11"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.test {
	outputs.dir(snippetsDir)
}

tasks.asciidoctor {
	inputs.dir(snippetsDir)
	dependsOn(tasks.test)
}

tasks.register<NpmTask>("appNpmInstall") {
	description = "Installs all dependencies from package.json"
	workingDir.set(file("${project.projectDir}/src/main/webapp"))
	args.set(listOf("install"))
}

tasks.register<NpmTask>("appNpmBuild") {
	dependsOn("appNpmInstall")
	description = "Builds project"
	workingDir.set(file("${project.projectDir}/src/main/webapp"))
	args.set(listOf("run", "build"))
}

tasks.register<Copy>("copyWebApp") {
	dependsOn("appNpmBuild")
	description = "Copies built project to where it will be served"
	from("src/main/webapp/build")
	into("src/main/resources/static/.")
}
