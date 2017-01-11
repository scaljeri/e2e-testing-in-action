FROM node

COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY files/server /server
RUN cd /server && npm install

EXPOSE 8080

CMD ["/usr/bin/supervisord"]

