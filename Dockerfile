FROM node:latest

ADD start.sh /app/api/start.sh
RUN chmod 755 /app/api/start.sh
CMD ["/start.sh"]
