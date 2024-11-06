import options from './config';
import { app, checkConnection } from './app';

app.listen(options.port, () => {
  checkConnection().catch(console.error);
  console.log(`Server is listening on PORT ${options.port}`);
});