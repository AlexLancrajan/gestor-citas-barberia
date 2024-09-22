import options from './config';
import app from './app';

app.listen(options.port, () => {
  console.log(`Server is listening on PORT ${options.port}`);
});