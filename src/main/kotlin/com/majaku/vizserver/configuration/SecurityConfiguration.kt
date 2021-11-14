package com.majaku.vizserver.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

@Configuration
@EnableWebSecurity
class SecurityConfiguration : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity?) {
        http!!.csrf().disable()
                .authorizeRequests()
                .antMatchers("/checkout/**").permitAll()
                //.authenticated()
                //.and()
                //.formLogin()
    }

}